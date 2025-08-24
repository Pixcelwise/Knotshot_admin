import React from 'react'

const Header = () => {

    const brandStyle = {
        fontFamily: '"Mr De Haviland", cursive',
        fontWeight: 600,
        color: '#000',
        fontSize: '80px',
        marginRight: 'auto',
        transition: 'color 0.3s ease, font-size 0.3s ease',
      }
    
  return (
    <div>
      <h1 style={brandStyle} className='text-center'>Knotshots admin pannel</h1>
        <p className='text-gray-400 text-center'>~made with love ❤️ <span className='text-purple-500'>PixcelWise</span></p>
    </div>
  )
}

export default Header
