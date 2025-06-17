import React from 'react';
import ChildrenImage from '../../../assets/images/ChildrenImage.png';


const BrandSection: React.FC = () => {
  return (
   
    <section className='grid grid-cols-1 gap-4 p-4 mx-4 text-white border-2 rounded-xl border-secondary md:p-8 md:mx-32 md:grid-cols-2 bg-primary'>
        <div className='flex flex-col items-center justify-center gap-12 md:px-8 md:py-8'>
            <p className='font-bold text-[24px] '>The Ultimate Tool—Made by Students, For Students</p>
            <p className='text-[20px]'>We’ve cracked the student code — turning messy class notes into smart study material instantly.</p>
            <p className='text-[20px]'>Built with real student struggles in mind, ClassMate AI is your academic sidekick — smarter, faster, and always on.</p>
        </div>
        <div className='flex flex-col  justify-center rounded-xl bg-secondary items-center'><img src={ChildrenImage} alt="Children" /></div>
    </section>
   
  );
};

export default BrandSection;