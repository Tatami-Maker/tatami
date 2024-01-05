import Image from "next/image";
import { useContext } from "react";
import { FormContext, FormContextType } from "./create-feature";
import FormComponent, { FormButton, FormMinHeading, FormMinText, FormTopHeading } from "./form-component";
import {useCreateMetadata} from "./create-data-access";
import { useWallet } from "@solana/wallet-adapter-react";
// import toast from "react-hot-toast";
import { PublicKey } from "@solana/web3.js";

type FormReviewProps = {
    imgLink: string,
    tx: string,
    jsonLink: string,
    buttonText: string
    setImgLink: (s: string) => void,
    setJsonLink: (s: string) => void,
    setTx: (s: string) => void,
    setButtonText: (s: string) => void
}

export function FormReview({
    imgLink, tx, jsonLink, buttonText, setImgLink, setJsonLink, setTx, setButtonText
}: FormReviewProps) {
    const {formData, img, imgFile, setPage} = useContext(FormContext) as FormContextType;
    const {publicKey} = useWallet();

    const mutation = useCreateMetadata({
        img: imgFile as File,
        address: publicKey as PublicKey,
        setButtonText,
        setImgLink,
        setJsonLink,
        setTx,
        formData,
        isImg: imgLink,
        isJson: jsonLink,
        isTx: tx
    });

    const handleCreateButton = () => {
        mutation.mutate()

    }

    return (
        <div className="flex flex-col md:flex-row w-full">
            <div className="create-main w-full md:w-3/4 flex flex-col items-center gap-6 z-10 mt-8">
                <FormTopHeading title="Review" />

                <FormComponent title="Branding" meta="">
                    <div className="flex flex-row justify-center">
                        <div className="key w-1/2 md:w-2/6">
                            <FormMinHeading title="Token Symbol" />
                            <FormMinHeading title="Token Symbol" />
                            <FormMinHeading title="Token Supply" />
                            <FormMinHeading title="Token Logo" />
                        </div>
                        <div className="value w-1/2 md:w-4/6">
                            <FormMinText title={formData.name} />
                            <FormMinText title={formData.symbol} />
                            <FormMinText title={`${formData.supply} ${formData.symbol}`} />
                            <div className="mt-3">
                                <Image src={window.URL.createObjectURL(img as Blob)} alt="token logo" width={34} height={34}/>
                            </div>
                        </div>
                    </div>
                </FormComponent>
                
                <FormComponent title="DAO Details" meta="">
                    <div className="flex flex-row justify-center">
                        <div className="key w-1/2 md:w-2/6">
                            <FormMinHeading title="DAO Name" />
                            <FormMinHeading title="Quorum" />
                            <FormMinHeading title="Min tokens for proposal" />
                            <FormMinHeading title="Vote Base time" />
                        </div>
                        <div className="value w-1/2 md:w-4/6">
                            <FormMinText title={formData.daoName} />
                            <FormMinText title={formData.quorum+"%"} />
                            <FormMinText title={`${formData.minToVote} ${formData.symbol}`} />
                            <FormMinText title={formData.voteDuration/3600+" hours"} />                           
                        </div>
                    </div>
                </FormComponent>
                <div className="mb-16 flex flex-row items-start gap-1 text-[#9393A9]">
                    <FormButton title={buttonText} onClick={handleCreateButton} disabled={mutation.isPending}
                    addClass="bg-gradient-to-b from-golden-200 to-golden-100 text-white"/>
                    <FormButton title="Back" onClick={() => setPage(0)} />
                </div>
            </div>
        </div>
    )
}