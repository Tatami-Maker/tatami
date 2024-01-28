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
import { AnchorProvider, BN, Program, utils } from '@coral-xyz/anchor';
import idl from "../../app/utils/idl/tatami.json";
import {TatamiV2} from "../../app/utils/idl/tatami";
import { useTransactionToast } from '../ui/ui-layout';
import { useContext } from 'react';
import { FormContext } from './create-feature';
import { REALMS_PROGRAM_ID } from '@/app/utils/constants';
import { createRecord } from '@/app/actions/create-record';

export function useCreateMetadata({
  img, address, setButtonText, setImgLink, setJsonLink, setTx, setDbId, formData, isImg, isJson, isTx, isDbId
} : CreateMetadataProp) {
  const {connection} = useConnection();
  const wallet = useWallet();
  const transactionToast = useTransactionToast();
  const {setPage, setMint} = useContext(FormContext) as FormContextType;
  const umi = createUmi(connection);
  umi.use(bundlrUploader()).use(walletAdapterIdentity(wallet));

  return useMutation({
    mutationKey: ['create-metadata', { endpoint: connection.rpcEndpoint, address }],
    mutationFn: async(
      {teamWallet,recipients, allocation}:
      MutationProps
    ) => {
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
          await timer(700)
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
          await timer(700)
        } else {
          jsonLink = isJson
        }

        let tx = "";
        let mint = "";
        if (!isTx) {
          setButtonText("Confirm Transaction")

          // Create Project
          const isAllStar = allocation[3] ? true : false;

          const airdropValue = isAllStar ? allocation[1] + allocation[3] : allocation[1];
          const teamValue = allocation[0];
          const daoValue = allocation[2];

          const val = await sendInitTransaction(
            wallet,
            wallet as AnchorWallet, 
            connection,
            formData,
            jsonLink,
            setMint,
            teamWallet,
            teamValue,
            airdropValue,
            daoValue
          );
          setTx(val[0]);
          console.log(val[0]);
          mint = val[1];
          setButtonText("Transaction Confirmed");
          await timer(700);
        } else {
          tx = isTx;
        }
        
        let dbId = "";

        if (!isDbId) {
          setButtonText("Setting up Token Distribution");

          const allstarAllocation = allocation[3] ? allocation[3] : BigInt(0);
          const id = await createRecord(mint, recipients, allocation[1], allstarAllocation);
          setDbId(id);
          setButtonText("Token Created")
          await timer(1200);
        } else {
          dbId = isDbId
        };

        setPage(3);
        return tx;
      } catch(error) {
        setButtonText("Try Again")
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

export function useDaoAvailCheck(address: PublicKey) {
  const {connection} = useConnection();

  return useMutation({
    mutationKey: ['find-dao', {endpoint: connection.rpcEndpoint, address}],
    mutationFn: async() => {
      try {
        const account = await connection.getAccountInfo(address);
        if (account) {
          return true
        } else {
          return false
        }
      } catch(e) {
        console.log(e);
        return false;
      }
    }
  })  
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
  formData: FormContent, uri: string, setMint: (s: string) => void, teamWallet: PublicKey | null,
  teamAllocation: bigint, airdropAllocation: bigint, daoAllocation: bigint 
) {
  const programId = new PublicKey("HrKLeJB6yoSWkFzVSfsg8Yi3Zs4PKZ7qqjkMz978qqZv");
  const provider = new AnchorProvider(connection, anchorWallet, {commitment: "confirmed"});
  const program = new Program<TatamiV2>(idl as TatamiV2, programId, provider);
  const realmProgram = REALMS_PROGRAM_ID;
  const metadataProgram = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
  
  const [config] = PublicKey.findProgramAddressSync([Buffer.from("tatami-config")], programId);
  const [vault] = PublicKey.findProgramAddressSync([Buffer.from("tatami-vault")], programId);
  
  const mint = Keypair.generate();
  const tokenAccount = utils.token.associatedAddress({mint: mint.publicKey, owner: anchorWallet.publicKey});
  const teamTokenAccount = teamWallet? utils.token.associatedAddress({mint: mint.publicKey, owner: teamWallet }): null;

  setMint(mint.publicKey.toBase58());
  const councilMint = Keypair.generate();

  const {name, symbol, daoName, supply, quorum, minToVote, council, voteDuration} = formData;

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

  const daoTokenAccount = utils.token.associatedAddress({mint: mint.publicKey, owner: nativeTreasury});

  // Initiate Project
  const initProjectIx = await program.methods.initProject(6, name, symbol, uri, 
    [new BN(teamAllocation), new BN(airdropAllocation)]
  )
    .accounts({
      config,
      project,
      mint: mint.publicKey,
      tokenAccount,
      teamWallet,
      teamTokenAccount,
      metadata,
      metadataProgram,
      vault
    })
    .instruction()

  // Initiate DAO
  const initDaoIx = await program.methods.initializeDao(
    daoName, 
    new BN(daoAllocation),
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
    project,
    daoTokenAccount
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

  return [signature, mint.publicKey.toBase58()];
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