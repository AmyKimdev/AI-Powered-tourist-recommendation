'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

const FormSchema = z.object({
  username: z.string().min(2, {
    message: '이름은 두 글자 이상이어야 합니다.',
  }),
  email: z.string().email({
    message: '올바른 이메일 형식이 아닙니다.',
  }),
  password: z
    .string()
    .min(1, {
      message: '비밀번호가 입력되지 않았습니다.',
    })
    .min(8, {
      message: '비밀번호는 여덟 글자 이상이어야 합니다.',
    }),
  passwordCheck: z
    .string()
    .min(1, {
      message: '비밀번호가 입력되지 않았습니다.',
    })
    .min(8, {
      message: '비밀번호는 여덟 글자 이상이어야 합니다.',
    }),
});

function Join() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      password: '',
      passwordCheck: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className='text-foreground transition-colors hover:text-muted'>회원가입</button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className={`font-['Cafe24Moyamoya-Face-v1.0'] text-center text-3xl`}>
            회원가입
          </DialogTitle>
          {/* <DialogDescription>
             Make changes to your profile here. Click save when you're done.
           </DialogDescription> */}
        </DialogHeader>
        {/* <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              Name
            </Label>
            <Input id='name' defaultValue='Pedro Duarte' className='col-span-3' />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='username' className='text-right'>
              Email
            </Label>
            <Input type='password' id='username' defaultValue='@peduarte' className='col-span-3' />
          </div>
        </div> */}
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름</FormLabel>
                    <FormControl>
                      <Input placeholder='이름을 입력하세요.' {...field} />
                    </FormControl>
                    {/* <FormDescription>이름은 두 글자 이상이어야 합니다.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input placeholder='이메일을 입력하세요.' {...field} />
                    </FormControl>
                    {/* <FormDescription>This is your public display name.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='비밀번호를 입력하세요.' {...field} />
                    </FormControl>
                    {/* <FormDescription>비밀</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='passwordCheck'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호 확인</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='비밀번호를 재입력하세요.' {...field} />
                    </FormControl>
                    {/* <FormDescription>This is your public display name.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full' disabled={!form.formState.isValid}>
                회원가입
              </Button>
            </form>
          </Form>
        </div>
        {/* <DialogFooter>
           <button type='submit'>Save changes</button>
         </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}

export default Join;
