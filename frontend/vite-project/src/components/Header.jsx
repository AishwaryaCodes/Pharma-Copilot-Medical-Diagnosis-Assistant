import { FaUserDoctor } from "react-icons/fa6";

export default function Header() {
    return (
      <header className="bg-blue-100 w-full py-6 shadow">
        <h1 className="text-center text-3xl font-extrabold text-blue-800">
        <FaUserDoctor /> Pharma Copilot – Health Diagnosis AI
        </h1>
      </header>
    );
  }
  