import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useMediaQuery } from 'react-responsive';
import { Link } from '@inertiajs/react';
import { ArrowRight } from '@/utility/svg-icons';

const DataCard = ({ wargaStats, RtRwStats }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const cards = [
    {
      title: "Data Warga",
      stats: wargaStats,
      link: "dashboard/biodataUser#warga-data",
      linkText: "BIODATA WARGA"
    },
    {
      title: "Data Anggota RT/RW",
      stats: RtRwStats,
      link: "dashboard/biodataUser#rw-data",
      linkText: "BIODATA RT/RW"
    }
  ];

  const StatCard = ({ title, stats, link, linkText }) => (
      <div className="border-2 border-blue-3 rounded-[10px] shadow-lg h-full">
          <h2 className="text-lg font-bold text-blue-5 text-start border-b border-blue-3 p-4">
              {title}
          </h2>
          <ul>
              {stats.map((stat, index) => (
                  <li
                      key={index}
                      className="flex justify-between py-1 border-b text-blue-4 border-blue-3 p-4 mt-5 mb-5"
                  >
                      <span className="text-sm md:text-base">{stat.label}</span>
                      <span>{stat.value}</span>
                  </li>
              ))}
          </ul>
          <div className="flex justify-between items-center mt-4 w-full text-start mb-4 p-5">
              <p className="text-xl md:text-xl">{linkText}</p>
              <Link
                  href={link}
                  className="flex items-center text-blue md:text-base text-sm group transition-all"
              >
                  <p className="text-nowrap">lihat data</p>
                  <ArrowRight
                      className="ml-2 transition-transform group-hover:-rotate-45"
                      width="20"
                      height="20"
                  />
              </Link>
          </div>
      </div>
  );

  return (
    <div className="mb-8">
      {isMobile ? (
        <Carousel className="w-full">
          <CarouselContent>
            {cards.map((card, index) => (
              <CarouselItem  key={index}>
                <StatCard {...card} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {cards.map((card, index) => (
            <StatCard key={index} {...card} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DataCard;