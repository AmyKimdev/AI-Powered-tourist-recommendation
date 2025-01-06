'use client';

import { Button } from '@/components/ui/button.tsx';
import { useState } from 'react';

function ExpandButton() {
  const [isClicked, setIsClicked] = useState(false);

  function toggleActive() {
    setIsClicked((prev) => !prev);
  }

  if (typeof document !== 'undefined') {
    const temp = document.getElementById('temp_place_edit_container');
    const getButtonStyles = () => {
      return !isClicked
        ? (temp
            ? (temp.className = 'slideIn relative border-solid border-2 border-green-500 w-[120px]')
            : '',
          {
            value: 'off',
            content: '>',
          })
        : (temp
            ? (temp.className =
                'slideOut relative border-solid border-2 border-green-500 w-[300px]')
            : '',
          {
            value: 'on',
            content: '<',
          });
    };

    const { value, content, ...rest } = getButtonStyles();

    return (
      <Button
        className='absolute z-10 -right-11 top-[450px] hover:cursor-pointer'
        onClick={toggleActive}
        {...rest}
      >
        {content}
      </Button>
    );
  }
}
// }

export default ExpandButton;
