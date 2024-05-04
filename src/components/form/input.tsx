import React from "react";

interface IInput {
  id: string;
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  onChange: (e: any) => void;
  value?: string;
  helper?: string;
}

const Input = ({ id, name, label, placeholder, type, onChange, value, helper }: IInput) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-gray-300 text-sm md:text-[1.2rem]"
        style={{ marginRight: 0 }}
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        onChange={onChange}
        className="mt-2 bg-[#141414]/20 font-primary border border-neutral-500 text-neutral-200 text-sm placeholder:text-neutral-500 rounded-lg focus:border-neutral-300 focus:ring-neutral-300 active:border-neutral-400 active:ring-neutral-400 block w-full p-2.5"
        placeholder={placeholder}
        type={type}
        value={value}
        required
      />
      <div className="text-sm mt-1 font-primary text-neutral-400">{helper}</div>
    </div>
  );
};

export default Input;
