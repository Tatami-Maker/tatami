import { createDaoAddress } from "@/utils/validation";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { useCluster } from "../cluster/cluster-data-access";
import { SocialLinks } from "../socials/social-link";
import { FormContext, FormContextType } from "./create-feature";
import { FormButton } from "./form-component";

export function FormComplete() {
    const {formData, mint} = useContext(FormContext) as FormContextType;
    const {cluster} = useCluster();

    return (
        <div>
            <div className="flex flex-col items-center justify-center">
                <Image src="/coins.png" width={160} height={160} alt="coins" className="mt-12 md:mt-24"/>
                <h2 className="text-3xl font-semibold text-white my-2">Congratulations!</h2>
                <h4 className="text-xl font-semibold text-secondary-text">{formData.name} has been created</h4>
                <div className="my-4">
                    <Link href={`https://solscan.io/account/${mint}?cluster=${cluster.network}`} target="_blank" 
                      rel="noopener noreferrer" passHref>
                        <FormButton title="View Token" addClass="border-[1px] border-[#2C2C5A] bg-[#1E2043] py-3"/>
                    </Link>
                    <Link href={`https://app.realms.today/dao/${createDaoAddress(formData.daoName)}?cluster=${cluster.network}`} 
                      target="_blank" rel="noopener noreferrer" passHref>
                        <FormButton title="View DAO" addClass="border-[1px] border-[#2C2C5A] bg-[#1E2043] ml-4 py-3"/>
                    </Link>
                </div>
            </div>
            <div className="flex flex-col items-center my-4">
                <h6 className="text-white font-semibold my-3">Join our community</h6>
                <SocialLinks show={true}/>
            </div>
        </div>
        
    )
}