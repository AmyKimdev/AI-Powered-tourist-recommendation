'use client';

import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
const categoryList = ['인문장소', '자연', '액티비티', '문화시설'];
function PlaceCategory() {
  const [btnActive, setBtnActive] = useState(1);

  function handleSubmit(num: number) {
    setBtnActive(num);
  }
  return categoryList.map((item, idx) => (
    <Badge
      key={idx}
      variant='outline'
      className={`hover:cursor-pointer ${btnActive === idx ? 'bg-cyan-400 text-white' : ''}`}
      onClick={() => handleSubmit(idx)}
    >
      {item}
    </Badge>
  ));
}
export default PlaceCategory;
