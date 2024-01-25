import { PublicKey } from "@solana/web3.js";
import * as Joi from "joi";
import { REALMS_PROGRAM_ID } from "./constants";

export interface FormData {
    name: string,
    symbol: string,
    supply: bigint,
    daoName: string,
    quorum: number,
    minToVote: number,
    voteDuration: number,
    council: boolean,
    allocation: number[]
};

export interface FormDataError {
    [key: string]: string,
}

export const joiValidation = (data: FormData) => {
    const dataAny: any = {...data};
    dataAny.supply = dataAny.supply.toString(10);

    const schema = Joi.object({
        name: Joi.string().min(4).max(40).required(),
        symbol: Joi.string().alphanum().min(3).max(5).required(),
        supply: Joi.string().required(),
        daoName: Joi.string().min(4).max(40).required(),
        quorum: Joi.number().integer().min(1).max(100).required(),
        minToVote: Joi.number().integer().min(1).required(),
        voteDuration: Joi.number().integer().min(1).required(),
        council: Joi.bool().required(),
        allocation: Joi.array().items(Joi.number()).length(3)
    });

    return schema.validate(dataAny);
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
        REALMS_PROGRAM_ID
    )[0].toBase58();
}