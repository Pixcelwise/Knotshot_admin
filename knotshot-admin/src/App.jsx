import React from 'react'
import HeaderVideoUpload from './components/HeaderVideoUpload'
import Header from './common/Header'
import IntroSectionImages from './components/IntroSectionImages'
import GallerySection from './components/GallerySection'
import VideoUpload from './components/VideoUpload'
import CustomerMessage from './components/CustomerMessage'
import Testimonial from './components/Testimonial'
import ContactFooter from './common/Footer'

const App = () => {
  return (
    <>
      <div className='py-32 px-32'>
        <Header />

        <HeaderVideoUpload />
        <IntroSectionImages />
        <GallerySection />
        {/* <VideoUpload/> */}
        <Testimonial />
        <CustomerMessage />


      </div>
      <div>
        <ContactFooter />
      </div>
    </>
  )
}

export default App
