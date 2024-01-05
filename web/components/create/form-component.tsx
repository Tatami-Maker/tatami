import { ChangeEvent, ReactNode } from "react"

type FormElements = {
    title: string,
    meta: string,
    children: ReactNode
}

type FormInputProps = {
    name: string,
    placeholder: string,
    type: string,
    addClass: string,
    value?: string | number,
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void,
    readonly?: boolean,
    errorMsg?: string
}

type FormButtonProps = {
    title: string,
    onClick?: () => void,
    disabled?: boolean,
    addClass?: string
}

export default function FormComponent({title, meta, children}: FormElements) {
    return (
        <div className="bg-back-200 border-[1px] border-border-form rounded-lg w-11/12  md:w-7/12 overflow-hidden">
            <div className="p-4">
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                <p className="text-sm text-secondary-text">{meta}</p>
                <hr className='border-[#2C2C5A] border-b-[1px] my-3'/>
                {children}
            </div>
        </div>
    )
}

export function FormInput({name, placeholder, type, addClass, value, onChange, readonly, errorMsg}: FormInputProps) {
    return (
        <div className="form-input-element w-full">
            <FormMinHeading title={name} />
            <input type={type} placeholder={placeholder} className={`border-[1px] bg-border-form rounded-md h-10
            text-sm p-4 text-white ${addClass} ${errorMsg ? 'border-[#cc3300]' : 'border-[#1E2043]'}`} 
            value={value && value} onChange={onChange} 
            readOnly={readonly}/>
            <p className="text-[#cc3300] text-sm mt-2 font-normal">{errorMsg}</p>
        </div>
    )
}

export function FormMinHeading({title}: {title: string}) {
    return <h5 className="mt-3 my-1 text-sm text-white font-medium">{title}</h5>

}

export function FormMinText({title}: {title: string | number}) {
    return <h5 className="mt-3 my-1 text-sm text-secondary-text font-normal">{title}</h5>
}

export function FormTopHeading({title}: {title: string}) {
    return (
        <div className="bg-back-200 border-[1px] border-border-form rounded-lg w-11/12 md:w-7/12 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-[#F3BC51] to-[#936100]"></div>
            <div className="p-4">
            <h2 className="text-[22px] font-semibold text-white">{title}</h2>
            <p className="text-sm text-secondary-text">Style your organization and determine token&apos;s details</p>
            </div>
        </div>
    )
}

export function FormButton({title, onClick, disabled, addClass}: FormButtonProps) {
    return (
        <button className={`text-sm px-8 py-3 rounded-lg mb-8 font-medium text-secondary-text
            hover:cursor-pointer hover:bg-[#3b3b62]
            ${addClass} disabled:bg-none disabled:border-[1px] disabled:border-[#2C2C5A] 
            disabled:text-secondary-text disabled:bg-[#1E2043]`} 
            onClick={onClick} disabled={disabled}>
            {title}
        </button>
    )
}