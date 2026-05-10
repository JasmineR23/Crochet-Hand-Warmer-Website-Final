import React from 'react'
import './Hero.css'
import { handwarmerList } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const Hero = () => {

    const navigate = useNavigate()

    const getRandomItems = () => {
        const first = handwarmerList[Math.floor(Math.random() * handwarmerList.length)];
        let second = handwarmerList[Math.floor(Math.random() * handwarmerList.length)];

        while (second.id === first.id) {
            second = handwarmerList[Math.floor(Math.random() * handwarmerList.length)];
        }

        return [first, second];
    }

    const [img1, img2] = getRandomItems();
    return (

        <div className='hero-section'>
            <div className='top-row'>
                <img className='top-left' src={img1.hand_warmer_image} alt={img2.hand_warmer_name} />
                <div className='top-right'>
                    <h1>Crochet Hand Warmers</h1>
                    <p>Enjoy Handmade Crochet Handwarmers made from a variety of premium yarn</p>
                </div>
            </div>

            <div className='bottom-row'>
                <div className='bottom-left'>
                    <h2>Choose from our wide variety of choices</h2>
                    <div onClick={()=>navigate("/products")} className='order-now'>Order Now!</div>
                </div>
                <img className='bottom-right' src={img2.hand_warmer_image} alt={img2.hand_warmer_name} />

            </div>

        </div>
    )
}

export default Hero
