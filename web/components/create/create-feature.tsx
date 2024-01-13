'use client'

import { createContext, useEffect, useState } from "react";
import {presets} from "../dashboard/presets";
import {createDaoAddress, FormData, FormDataError, joiValidation} from "../../utils/validation";
import { FormDisplay } from "./form-display";
import { FormReview } from "./form-review";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { FormComplete } from "./form-complete";
import { PublicKey } from "@solana/web3.js";
import { useDaoAvailCheck } from "./create-data-access";

export type FormContextType = {
    img: Blob | undefined,
    imgFile: File | undefined,
    formData: FormData,
    type: number,
    setPage: (page: number) => void,
    setMint: (s: string) => void,
    mint: string
}

export const FormContext = createContext<FormContextType | null>(null);

export default function CreateFeature() {
    const params = useParams<{type: string}>();
    const typeParam = params.type;
    const typeParamNum = parseInt(typeParam);

    let type = 7;

    if (typeParam && !isNaN(typeParamNum) && typeParamNum < 7 && typeParamNum > 0) {
        type = parseInt(typeParam)
    }

    const {connected} = useWallet();
    const router = useRouter();

    useEffect(() => {
        if (!connected) {
            toast.error(`Wallet is not connected!`);
            router.push('/');
        }
    }, [connected, router])
    
    const preset = presets[type-1];
    const defaultErrors = {
        name: "", symbol: "", supply: "", daoName: "", quorum: "", minToVote: "", voteDuration: "", img: ""
    };

    const [page, setPage] = useState(0);
    const [imgFile, setImgFile] = useState<File>();
    const [mint, setMint] = useState("");

    const [img, setImg] = useState<Blob>();
    const [formData, setFormData] = useState<FormData>({
        name: "",
        symbol: "",
        supply: type == 5 ? 100 : 0,
        daoName: "",
        quorum: preset.quorum,
        minToVote: preset.minToVote,
        council: preset.council,
        voteDuration: preset.voteDuration
    });
    const [formError, setFormError] = useState<FormDataError>(defaultErrors);

    const [buttonText, setButtonText] = useState("Launch Token");
    const [imgLink, setImgLink] = useState("");
    const [jsonLink, setJsonLink] = useState("");
    const [tx, setTx] = useState("");

    const daoAddress = new PublicKey(createDaoAddress(formData.daoName));
    const daoMutation = useDaoAvailCheck(daoAddress);

    const handleChange = (property: string, value: string | number | boolean) => {
        const data = {...formData};
        
        switch(property) {
            case "name":
                if (typeof value !== "string") return;
                data[property] = value;
                break;
            
            case "symbol":
                if (typeof value !== "string") return;
                data[property] = value.toUpperCase();
                break;

            case "supply":
                if (typeof value !== "number") return;
                data[property] = value;
                break;

            case "daoName":
                if (typeof value !== "string") return;
                data[property] = value;
                break;
    
            case "voteDuration":
                if (typeof value !== "number") return;
                data[property] = value;
                break;

            case "council":
                if (typeof value !== "boolean") return;
                data[property] = value;
                break;
            
            case "quorum":
                if (typeof value !== "number") return;
                data[property] = value;
                break;
            
            case "minToVote":
                if (typeof value !== "number") return;
                data[property] = value;
                break;
            
            default:
                return;
        }

        setFormError({...defaultErrors})
        setFormData(data);
    }

    const handleForm = async() => {
        const errors: FormDataError = {...defaultErrors};

        if (!img) {
            errors.img = "No image is selected"; 
            setFormError(errors);
            return;
        }

        const result = joiValidation(formData);

        if (result.error) {
            const newErrorInc = result.error.message.slice(1);
            const quoteIndex = newErrorInc.indexOf('"');
            
            const property = newErrorInc.slice(0,quoteIndex);
            const newError = newErrorInc.replace('"', '');
            
            errors[property] = newError;
            setFormError(errors);

            return;
        } else {
            const isDaoExist = await daoMutation.mutateAsync();

            if (isDaoExist) {
                errors.daoName = "DAO with this name already exists";
                setFormError(errors);
                return;
            } else {
                setPage(1)
            }
        }
    }

    const handleImg = (selectImg: File | undefined) => {
        if (selectImg) {
            const reader = new FileReader();
            reader.onload = function(e) {
                if (e.target) {
                    const blob = new Blob([new Uint8Array(e.target.result as ArrayBuffer)], {type: selectImg.type });
                    setImg(blob);
                    setImgFile(selectImg);
                }
            };
            reader.readAsArrayBuffer(selectImg);
            setFormError({...defaultErrors})
        } else {
            setImg(undefined)
        }
    }

    return (
        <FormContext.Provider value={{formData, img, imgFile, type, mint, setPage, setMint}}>
            {   
                page === 2 ? 
                    <FormComplete />
                :    
                page === 1 ?
                    <FormReview imgLink={imgLink} jsonLink={jsonLink} tx={tx} buttonText={buttonText}
                    setImgLink={setImgLink} setJsonLink={setJsonLink} setTx={setTx} setButtonText={setButtonText} />
                :
                    <FormDisplay preset={preset} formError={formError} setFormError={setFormError} 
                    handleChange={handleChange} handleForm={handleForm} handleImg={handleImg} />
            }
        </FormContext.Provider>
    )
}