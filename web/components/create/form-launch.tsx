import { useContext, useEffect, useMemo, useState } from "react";
import { FormContext, FormContextType } from "./create-feature";
import FormComponent, { FormAllocationTab, FormButton, FormInput, FormMinHeading, FormTopHeading } from "./form-component";
import {useCreateMetadata} from "./create-data-access";
import { useWallet } from "@solana/wallet-adapter-react";
// import toast from "react-hot-toast";
import { PublicKey } from "@solana/web3.js";
import {Chart} from "chart.js/auto";

type FormLaunchProps = {
    imgLink: string,
    tx: string,
    jsonLink: string,
    buttonText: string
    setImgLink: (s: string) => void,
    setJsonLink: (s: string) => void,
    setTx: (s: string) => void,
    setButtonText: (s: string) => void
}

export function FormLaunch({
    imgLink, tx, jsonLink, buttonText, setImgLink, setJsonLink, setTx, setButtonText
}: FormLaunchProps) {
    const {formData, setPage, imgFile} = useContext(FormContext) as FormContextType;
    const {publicKey} = useWallet();

    const [selectList, setSelectList] = useState(false);
    const [allocation, setAllocation] = useState(formData.allocation);
    const [allocError, setAllocError] = useState("");

    const allocationTabs = useMemo(() => ["Team", "Airdrop", "DAO Allocation"], []);

    const updateAllocation = (index: number, val: number) => {
        setAllocError("");
        const newAlloc = [...allocation];
        newAlloc[index] = val;
        setAllocation(newAlloc);
    }

    // Donut Chart Setup
    useEffect(() => {    
        const chartDiv = document.querySelector(".canvas-div");
        const canvas = document.createElement("canvas");
        canvas.classList.add('canvas-chart');

        new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: allocationTabs.map((t,i) => [t, allocation[i]].join(" ")+"%"),
                datasets: [{
                    label: 'Token Distribution',
                    data: allocation,
                    backgroundColor: ['#FF4906','#19B400','#F3BC51'],
                    borderColor: "#040216",
                    hoverOffset: 4,
                    borderRadius: 6,
                    spacing: 2,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });

        const canvasParent = document.querySelector(".canvas-parent") as Element;
        const canvasChart =  document.querySelector('.canvas-chart') as Element;

        if (document.contains(document.querySelector('.canvas-chart'))) {
            canvasChart.remove()
        }

        canvasParent.insertBefore(canvas, chartDiv);
    }, [allocation, allocationTabs]);

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
        const sum = allocation.reduce((a,b) => {
            const num: number = isNaN(b) ? 0 : b;
            return a + num;
        }, 0);

        if (sum !== 100) {
            setAllocError("The sum of allocation must be equal to 100");
        } else {
            mutation.mutate()
        }
    }

    return (
        <div className="flex flex-col md:flex-row w-full mb-16">
            <div className="create-main w-full md:w-3/4 flex flex-col items-center gap-6 z-10 mt-8">
                <FormTopHeading title="Launch" />

                <FormComponent title="Airdrop Participants" addButton={true} meta="">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-3 row-span-2 row-end-2">
                        <FormInput name="Wallet Address" placeholder="eg. krux...gvCH" type="string" addClass="w-full"/>
                        </div>
                        <FormButton title="Add Address" addClass="text-xs md:text-sm lg:px-auto text-sm py-[9px] border-[1px] 
                        border-[#2C2C5A] bg-[#1E2043] hover:bg-gradient-to-b from-golden-200 to-golden-100 text-secondary-text 
                        row-end-2 mb-2 col-span-1 whitespace-nowrap"/>
                    </div>
                </FormComponent>

                <FormComponent title="Curated List" meta="Choose premium lists of Solana users to participate in your coin">
                    <div className={`w-full md:w-1/2 border-[1px] ${selectList ? "border-golden-100" : "border-border-form"} rounded-md py-2 
                        px-4 cursor-pointer bg-gradient-to-b from-[#05051C] to-[#150A40] mt-4`} 
                        onClick={() => setSelectList(!selectList)}>
                        <div className="flex flex-row justify-between items-center">
                            <FormMinHeading title="All Stars List"/>
                            <button className={`${selectList ? "bg-gradient-to-b from-golden-100 to-golden-200" : "bg-white"}
                            rounded-sm w-6 h-6 mr-2 mt-1 `}></button>
                        </div>
                        <hr className='border-[#2C2C5A] border-b-[1px] my-3'/>
                        <ul className='list-disc list-outside text-secondary-text text-left ml-4 mb-4 relative text-sm'>
                            <li key={1}>Wallets that are subscribed to Tatami</li>
                            <li key={2}>Recent transactions in the last month</li>
                        </ul>
                    </div>
                </FormComponent>
            
                <FormComponent title="Distribution Amounts" meta="Select who and how much people recieve">
                    <div className="canvas-parent w-full md:w-1/2 m-auto">
                        <div className="canvas-div"></div>
                    </div>
                    <hr className='border-[#2C2C5A] border-b-[1px] my-3'/>
                <div className="flex flex-col items-center my-5 gap-4">
                    {allocationTabs.map((tab, tabIx) => (
                        <FormAllocationTab 
                            tabName={tab}
                            tabIx={tabIx} 
                            tabVal={allocation[tabIx]} 
                            changeTabVal={updateAllocation} 
                            key={tabIx}
                        />
                    ))}
                </div>
                <p className="text-[#cc3300] text-sm mt-2 font-normal ml-4">{allocError}</p>

                </FormComponent>

                <div className="mb-16 flex flex-row items-start gap-1 text-[#9393A9]">
                    <FormButton title={buttonText} onClick={handleCreateButton} disabled={mutation.isPending}
                    addClass="bg-gradient-to-b from-golden-200 to-golden-100 text-white px-8 py-3"/>
                    <FormButton title="Back" onClick={() => setPage(1)} addClass="px-8 py-3" />
                </div>
            </div>
        </div>
    )
}