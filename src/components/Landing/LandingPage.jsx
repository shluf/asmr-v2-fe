'use client'

import React, { useEffect, useState } from "react"
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useAuth } from "@/hooks/auth"
import NavigationBar from './NavigationBar'
import BannerSection from './BannerSection'
import AboutSection from './AboutSection'
import HowItWorksSection from './HowItWorksSection'
import FeedbackSection from './FeedbackSection'
import FooterSection from './FooterSection'

const LandingPage = () => {
    const { user } = useAuth({ middleware: 'guest' })
    const [scrolled, setScrolled] = useState(false)
    const [activeSection, setActiveSection] = useState("beranda")

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        })
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled)
            }

            const sections = ["beranda", "tentang", "cara-kerja", "kritik-saran"]
            sections.forEach((section) => {
                const sectionElement = document.getElementById(section)
                if (sectionElement) {
                    const rect = sectionElement.getBoundingClientRect()
                    if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                        setActiveSection(section)
                    }
                }
            })
        }

        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [scrolled])

    return (
        <main className="bg-gray-100 font-sans">
            <NavigationBar scrolled={scrolled} activeSection={activeSection} user={user} />
            <div className="flex flex-col">
                <BannerSection user={user} />
                <AboutSection />
                <HowItWorksSection />
                <FeedbackSection />
                <FooterSection />
            </div>
        </main>
    )
}

export default LandingPage
