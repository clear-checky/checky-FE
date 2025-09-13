import { useNavigate } from 'react-router-dom';

interface HeaderButtonProps {
    to: string;
    children: React.ReactNode;
    variant?: 'text' | 'primary';
    className?: string;
}

export default function HeaderButton({
    to,
    children,
    variant = 'text',
    className = ''
}: HeaderButtonProps) {
    const navigate = useNavigate();

    const baseClasses = "font-regular cursor-pointer transition-all duration-200";
    const variantClasses = {
        text: "hover:text-primary hover:scale-105",
        primary: "bg-secondary text-white px-6 py-2 rounded-[10px] font-bold hover:bg-secondary/90 hover:scale-105"
    };

    return (
        <button
            onClick={() => navigate(to)}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        >
            {children}
        </button>
    );
}
