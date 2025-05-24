import { Button } from "@/components/ui/button";

export const PrimaryButton = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="bg-white text-blue-600 hover:bg-blue-50"
    >
      {children}
    </Button>
  );
};
