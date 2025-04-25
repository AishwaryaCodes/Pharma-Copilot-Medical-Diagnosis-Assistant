//src/components/Header.jsx

import { FaUserDoctor } from "react-icons/fa6";

export default function Header() {
  return (
    <header className="bg-blue-100 w-full py-3 shadow">
      <div className="flex justify-center items-center gap-3">
        <FaUserDoctor className="text-4xl text-blue-800" />
        <h1 className="text-3xl font-extrabold text-blue-800">
          Health Diagnosis AI
        </h1>
      </div>
    </header>
  );
}
