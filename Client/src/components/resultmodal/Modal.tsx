'use client';

import React, { ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface ModalProps {
  button: ReactNode;
  title: string;
  content: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ button, title, content }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>{button}</button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
