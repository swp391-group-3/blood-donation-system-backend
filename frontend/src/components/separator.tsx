export interface SeparatorProps {
    text: string;
}

export const Separator = ({ text }: SeparatorProps) => {
    return (
        <div className="relative my-8 flex items-center">
            <div className="flex-grow border-t border-black/50"></div>
            <span className="mx-3 text-xs">{text}</span>
            <div className="flex-grow border-t border-black/50"></div>
        </div>
    );
};
