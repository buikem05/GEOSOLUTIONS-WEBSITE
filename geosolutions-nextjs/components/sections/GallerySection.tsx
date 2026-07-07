// components/sections/GallerySection.tsx — Server Component

import Image from 'next/image';

type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
  wide?: boolean;
  tall?: boolean;
};

const galleryItems: GalleryItem[] = [
  { src: '/images/img11.jpeg', alt: 'Large classroom session', caption: 'Academic Training', wide: true },
  { src: '/images/img8.jpeg',  alt: 'CBT lab session', caption: 'CBT / Tech Lab' },
  { src: '/images/img17.jpeg', alt: 'Tech training class', caption: 'Tech Training' },
  { src: '/images/img1.jpeg',  alt: 'Students on laptops', caption: 'Computer Skills' },
  { src: '/images/img14.jpeg', alt: 'Geosolution building', caption: 'Our Centre', tall: true },
  { src: '/images/img2.jpeg',  alt: 'Students in lecture', caption: 'JAMB Coaching' },
  { src: '/images/img5.jpeg',  alt: 'Instructor with students', caption: 'Expert Tutors' },
  { src: '/images/img9.jpeg',  alt: 'Classroom full of students', caption: 'Exam Prep' },
  { src: '/images/img12.jpeg', alt: 'Students studying', caption: 'Group Study' },
  { src: '/images/img3.jpeg',  alt: 'Students in session', caption: 'Learning in Progress', wide: true },
];

export function GallerySection() {
  return (
    <section id="gallery" className="geo-section bg-slate-50 dark:bg-dark-surface">
      <div className="geo-container">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-geo-100 dark:bg-geo-900/30 text-geo-700 dark:text-geo-300 text-sm font-semibold mb-3">
            Our Campus Life
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            See Geosolution in Action
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Real moments from our classrooms, tech lab, and community — captured for you.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[220px] gap-4">
          {galleryItems.map(({ src, alt, caption, wide, tall }) => (
            <div
              key={src}
              className={[
                'group relative overflow-hidden rounded-2xl',
                wide ? 'col-span-2' : '',
                tall ? 'row-span-2' : '',
              ].join(' ')}
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-geo-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="absolute bottom-4 left-4 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                {caption}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
