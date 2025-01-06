'use client';

import { Button } from '@/components/ui/button.tsx';
import { cn } from '@/lib/utils.ts';
import { useState } from 'react';

const TravelPlanCheckButton = (prop: { changeSelectCountFunction: Function }) => {
  const [isChecked, setIsChecked] = useState(false);
  //   const [placeSelectCount, setPlaceSelectCount] = useState(0);
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
          variant: 'outline',
          className:
            'inline-flex items-center justify-center whitespace-nowrap border-none w-1 h-10 px-4 py-2 rounded-md bg-cyan-500/50 text-white text-xl',
        };
  };

  const { className, variant, ...rest } = getButtonStyles();

  function toggleActive() {
    setIsChecked((prev) => !prev);
  }
  return !isChecked ? (
    <Button
      className={cn(className)}
      onClick={
        () => {
          prop.changeSelectCountFunction(isChecked), toggleActive();
        }
        //순서를 바꾸면 toggleActive()가 먼저 실행되어 작동을 안함.
      }
      variant='outline'
      {...rest}
    >
      +
    </Button>
  ) : (
    <Button
      className={cn(className)}
      onClick={() => {
        prop.changeSelectCountFunction(isChecked), toggleActive();
      }}
      variant='check'
      {...rest}
    >
      &#10003;
    </Button>
  );
};

export default TravelPlanCheckButton;
