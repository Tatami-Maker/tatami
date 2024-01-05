import { PublicKey } from "@solana/web3.js";
import * as Joi from "joi";

export interface FormData {
    name: string,
    symbol: string,
    supply: number,
    daoName: string,
    quorum: number,
    minToVote: number,
    voteDuration: number,
    council: boolean
};

export interface FormDataError {
    [key: string]: string,
}

export const joiValidation = (data: FormData) => {
    const schema = Joi.object({
        name: Joi.string().min(4).max(40).required(),
        symbol: Joi.string().alphanum().min(3).max(5).required(),
        supply: Joi.number().integer().min(1).required(),
        daoName: Joi.string().min(4).max(40).required(),
        quorum: Joi.number().integer().min(1).max(100).required(),
        minToVote: Joi.number().integer().min(1).required(),
        voteDuration: Joi.number().integer().min(1).required(),
        council: Joi.bool().required()
    });

    return schema.validate(data);
}

export const getImgBuff = async(img: Blob) => {
    try {
        const buf = await img.arrayBuffer();
        return Buffer.from(buf).toString('hex')
    } catch(e: unknown) {
        return e;
    }
}

export const createDaoAddress = (daoName: string) => {
    return PublicKey.findProgramAddressSync([
        Buffer.from("governance"),
        Buffer.from(daoName)
    ],
        new PublicKey("GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw")
    )[0].toBase58();
}