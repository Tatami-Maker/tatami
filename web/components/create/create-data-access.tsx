import {
  Connection,
    Keypair,
    PublicKey,
    TransactionInstruction,
    TransactionMessage,
    VersionedTransaction,
} from '@solana/web3.js';
import { AnchorWallet, useConnection, useWallet, WalletContextState } from '@solana/wallet-adapter-react';
// import { useTransactionToast } from '../ui/ui-layout';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createGenericFileFromBrowserFile, createGenericFileFromJson, Umi } from '@metaplex-foundation/umi';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { bundlrUploader } from '@metaplex-foundation/umi-uploader-bundlr';
import { AnchorProvider, BN, Program } from '@coral-xyz/anchor';
import idl from "../../utils/idl/tatami.json";
import {TatamiV2} from "../../utils/idl/tatami";
import { FormData } from '@/utils/validation';
import { useTransactionToast } from '../ui/ui-layout';
import { useContext } from 'react';
import { FormContext, FormContextType } from './create-feature';

type CreateMetadataProp = {
  img: File, 
  address: PublicKey,
  formData: FormData,
  isImg: string,
  isJson: string,
  isTx: string,
  setButtonText: (s: string) => void,
  setImgLink: (s: string) => void,
  setJsonLink: (s: string) => void,
  setTx: (s: string) => void
}

export function useCreateMetadata({
  img, address, setButtonText, setImgLink, setJsonLink, setTx, formData, isImg, isJson, isTx
} : CreateMetadataProp) {
  const {connection} = useConnection();
  const wallet = useWallet();
  const transactionToast = useTransactionToast();
  const {setPage, setMint} = useContext(FormContext) as FormContextType;
  const umi = createUmi(connection);
  umi.use(bundlrUploader()).use(walletAdapterIdentity(wallet));

  return useMutation({
    mutationKey: ['create-metadata', { endpoint: connection.rpcEndpoint, address }],
    mutationFn: async() => {
      try {
        let imageLink = "";
    
        if (!isImg) {
          setButtonText("Upload Image")
        
          // Upload Image
          const imgUri = await uploadImg(img, umi);
          imageLink = imgUri[0];
          console.log(imageLink)
          setImgLink(imageLink);
          setButtonText("Image Uploaded")
          await timer(500)
        } else {
          imageLink = isImg;
        }

        let jsonLink = "";

        if (!isJson) {
          setButtonText("Upload Metadata")
          // Upload Json
          const jsonUri = await uploadJson(imageLink, formData.name, formData.symbol, umi);
          jsonLink = jsonUri[0];
          console.log(jsonLink)
          setJsonLink(jsonLink);
          setButtonText("Metadata Uploaded")
          await timer(500)
        } else {
          jsonLink = isJson
        }

        let tx = "";
        if (!isTx) {
          setButtonText("Confirm Transaction")

          // Create Project
          tx = await sendInitTransaction(
            wallet,
            wallet as AnchorWallet, 
            connection,
            formData,
            jsonLink,
            setMint
          );
          setTx(tx);
          console.log(tx);
        } else {
          tx = isTx;
        }
        
        setButtonText("Token Created");
        await timer(1200);
        setPage(2);
        return tx;
      } catch(error) {
        return emitError(error);
      }
    },
    onSuccess: (tx: unknown) => {
      if (typeof tx === "string") {
        transactionToast(tx);
      }
    }
  });
}

async function uploadImg(img: File, umi: Umi) {
  const genericImg = await createGenericFileFromBrowserFile(img);
  return await umi.uploader.upload([genericImg], {
    onProgress: (percent) => {
      console.log(`${percent * 100}% uploaded...`);
    },
  })
}

async function uploadJson(imageLink: string, name: string, symbol: string, umi: Umi) {
  const jsonFile = {
    name,
    symbol,
    description: "",
    image: imageLink,
    creator: {
      name: "Tatami",
      site: "https://tatami.so"
    }
  };

  const genericJson = createGenericFileFromJson(jsonFile);
  return await umi.uploader.upload([genericJson], {
    onProgress: (percent) => {
      console.log(`${percent * 100}% uploaded...`);
    },
  })
}

async function sendInitTransaction(
  wallet: WalletContextState, anchorWallet: AnchorWallet, connection: Connection, 
  formData: FormData, uri: string, setMint: (s: string) => void
) {
  const programId = new PublicKey("HrKLeJB6yoSWkFzVSfsg8Yi3Zs4PKZ7qqjkMz978qqZv");
  const provider = new AnchorProvider(connection, anchorWallet, {commitment: "confirmed"});
  const program = new Program<TatamiV2>(idl as TatamiV2, programId, provider);
  const realmProgram = new PublicKey("GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw");
  const metadataProgram = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
  
  const [config] = PublicKey.findProgramAddressSync([Buffer.from("tatami-config")], programId);
  const [vault] = PublicKey.findProgramAddressSync([Buffer.from("tatami-vault")], programId);
  
  const mint = Keypair.generate();
  setMint(mint.publicKey.toBase58());
  const councilMint = Keypair.generate();

  const {name, symbol, daoName, quorum, minToVote, council, voteDuration} = formData;

  const [metadata] = PublicKey.findProgramAddressSync([
    Buffer.from("metadata"),
    metadataProgram.toBuffer(),
    mint.publicKey.toBuffer(),
  ], 
    metadataProgram
  );

  const [project] = PublicKey.findProgramAddressSync([
    Buffer.from("tatami-project"),
    mint.publicKey.toBuffer()
  ], programId);

  const [realmAccount] = PublicKey.findProgramAddressSync([
    Buffer.from("governance"),
    Buffer.from(daoName)
  ], realmProgram);

  const [communityTokenHolding] = PublicKey.findProgramAddressSync([
    Buffer.from("governance"),
    realmAccount.toBytes(),
    mint.publicKey.toBytes()
  ], realmProgram);

  const [councilTokenHolding] = PublicKey.findProgramAddressSync([
    Buffer.from("governance"),
    realmAccount.toBytes(),
    councilMint.publicKey.toBytes()
  ], realmProgram);

  const [realmConfig] = PublicKey.findProgramAddressSync([
    Buffer.from('realm-config'),
    realmAccount.toBytes()
  ], realmProgram);

  const governedAccount = Keypair.generate().publicKey;

  const [governance] = PublicKey.findProgramAddressSync([
    Buffer.from("account-governance"),
    realmAccount.toBytes(),
    governedAccount.toBytes()
  ], realmProgram);

  const [nativeTreasury] = PublicKey.findProgramAddressSync([
    Buffer.from("native-treasury"),
    governance.toBytes()
  ], realmProgram);

  const initProjectIx = await program.methods.initProject(name, symbol, uri)
    .accounts({
      config,
      project,
      mint: mint.publicKey,
      metadata,
      metadataProgram,
      vault
    })
    .instruction()

  const initDaoIx = await program.methods.initializeDao(
    daoName, 
    new BN(minToVote),
    council,
    quorum,
    new BN(voteDuration)
  )
  .accounts({
    mint: mint.publicKey,
    councilMint: councilMint.publicKey,
    communityTokenHolding,
    realmAccount,
    realmConfig,
    realmProgram,
    councilTokenHolding,
    governance,
    governedAccount,
    nativeTreasury,
    project
  })
  .instruction();

  const {transaction, latestBlockhash} = await createTransaction({
    ixs: [initProjectIx, initDaoIx], connection, payer: wallet.publicKey as PublicKey
  });

  transaction.sign([mint, councilMint]);

  const signature = await wallet.sendTransaction(transaction, connection);

  await connection.confirmTransaction(
    { signature, ...latestBlockhash },
    'confirmed'
  );

  return signature;
}

function emitError(error: unknown) {
  console.log('error', `Transaction failed! ${JSON.stringify(error)}`);
  toast.error(`Transaction failed! ${error}`);
  return error;
}

async function createTransaction({
  ixs,
  connection,
  payer
}: {
  ixs: TransactionInstruction[],
  connection: Connection,
  payer: PublicKey
}): Promise<{
  transaction: VersionedTransaction;
  latestBlockhash: { blockhash: string; lastValidBlockHeight: number };
}> {
  const latestBlockhash = await connection.getLatestBlockhash();

  console.log(payer.toBase58());

  const messageLegacy = new TransactionMessage({
    payerKey: payer,
    recentBlockhash: latestBlockhash.blockhash,
    instructions: ixs,
  }).compileToV0Message();

  const transaction = new VersionedTransaction(messageLegacy);

  return {
    transaction,
    latestBlockhash,
  };
}

function timer(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}