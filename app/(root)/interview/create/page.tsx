import { ContentWrapper } from '@/components/ComponentWrapper';
import InterviewForm from '@/components/InterviewForm';
import React from 'react'

const page = async () => {

  return (
    <ContentWrapper>
      <div className='flex flex-col gap-4 items-center'>
        <InterviewForm />
      </div>
    </ContentWrapper>
  )
}

export default page