//components/travelItinery/TravelPlanCheckButtons.tsx
import { Button } from '@/components/ui/button.tsx';
import { cn } from '@/lib/utils.ts';
import { useState } from 'react';

const TravelPlanCheckButton = () => {
  const [isChecked, setIsChecked] = useState(false);
  const getButtonStyles = () => {
    return !isChecked
      ? {
          value: 'off',
          variant: 'outline',
          className:
            'inline-flex items-center justify-center whitespace-nowrap border border-input w-1 h-10 px-4 py-2 rounded-md bg-accent text-2xl text-gray-500/50',
        }
      : {
          value: 'on',
          variant: 'primary',
          className:
            'inline-flex items-center justify-center whitespace-nowrap border-none w-1 h-10 px-4 py-2 rounded-md bg-cyan-500/50 text-white text-xl',
        };
  };

  const { className, variant, ...rest } = getButtonStyles();

  function toggleActive() {
    setIsChecked((prev) => !prev);
  }

  return (
    <Button
      className={cn(className)}
      onClick={toggleActive}
      variant={variant as "outline" | "default" | "destructive" | "secondary" | "ghost" | "link" | "blue" | null}
      {...rest}
    >
      {isChecked ? '✓' : '+'}
    </Button>
  );
};

export default TravelPlanCheckButton;