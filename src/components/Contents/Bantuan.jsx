'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PhoneCall } from "lucide-react"

const Bantuan = ({ role }) => {
  const isWarga = role === 'Warga'

  return (
    <div className='flex mt-8 md:mt-0 justify-center items-center mx-8'>
    <Card className="w-full max-w-md mx-auto hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">Bantuan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-muted-foreground">
          Mohon hubungi nomor di bawah ini jika Anda mengalami kesulitan:
        </p>
        <div className='flex flex-col justify-center items-center'>
          <div className={`flex items-center ${isWarga ? "justify-start" : "justify-center"} md:w-2/3 w-full space-x-2`}>
            <PhoneCall className="w-5 h-5 text-green-500" />
            <div className='flex items-center'>
              <p className="font-bold text-md w-20">ADMIN</p><span className='mx-1'>:</span>
              <p>0817973xxxx</p>
            </div>
          </div>
            {isWarga &&
              <>        
              <div className="flex items-center justify-start md:w-2/3 w-full space-x-2">
                <PhoneCall className="w-5 h-5 text-green-500" />
                <div className='flex items-center'>
                  <p className="font-bold text-md w-20">RT</p><span className='mx-1'>:</span>
                  <p>0817973xxxx</p>
                </div>
              </div>
              <div className="flex items-center justify-start md:w-2/3 w-full space-x-2">
                <PhoneCall className="w-5 h-5 text-green-500" />
                <div className='flex items-center'>
                  <p className="font-bold text-md w-20">RW</p><span className='mx-1'>:</span>
                  <p>0817973xxxx</p>
                </div>
              </div>
              </>
              }
        </div>
        <div className="flex md:flex-row flex-col gap-4">
        <Button className="w-full md:mt-4" variant="outline" onClick={() => window.location.href = 'tel:0817973xxxx'}>
          Admin
        </Button>
        {isWarga && 
          <>
            <Button className="w-full md:mt-4" variant="outline" onClick={() => window.location.href = 'tel:0817973xxxx'}>
              RT
            </Button>
            <Button className="w-full md:mt-4" variant="outline" onClick={() => window.location.href = 'tel:0817973xxxx'}>
              RW
            </Button>
          </>
        }
        </div>
      </CardContent>
    </Card>
    </div>
  )
}

export default Bantuan