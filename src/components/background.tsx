/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'
import React, { useEffect, useState } from 'react';
import { useColorContext } from '~/lib/colorContext';
import { motion } from 'framer-motion';

export default function Background() {
  const { activeColorSet } = useColorContext();
  const [prevColorSet, setPrevColorSet] = useState(activeColorSet);

  useEffect(() => {
    setPrevColorSet(activeColorSet);
  }, [activeColorSet]);

  return (
    <div className="h-full w-full relative overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{
          opacity: [1, 0],
        }}
        transition={{
          duration: 0.5,
          ease: 'easeInOut',
        }}
      >
        <div className="gradient-container">
          <div className="gradient-box gradient-box-1">
            <div className={`gradient-inner ${prevColorSet.radialGradientBg2}`}></div>
          </div>
          <div className="gradient-box gradient-box-2">
            <div className={`gradient-inner ${prevColorSet.radialGradientBg1}`}></div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 1],
        }}
        transition={{
          duration: 1,
          ease: 'easeInOut',
        }}
      >
        <div className="gradient-container">
          <div className="gradient-box gradient-box-1">
            <div className={`gradient-inner ${activeColorSet.radialGradientBg2}`}></div>
          </div>
          <div className="gradient-box gradient-box-2">
            <div className={`gradient-inner ${activeColorSet.radialGradientBg1}`}></div>
          </div>
        </div>
      </motion.div>

      <div className="bg-noise absolute inset-0"></div>
    </div>

    // <div className="gradient-container">
    //   <div className="gradient-box gradient-box-1">
    //     <div className="gradient-inner gradient-inner-1"></div>
    //   </div>

    //   <div className="gradient-box gradient-box-2">
    //     <div className="gradient-inner gradient-inner-2"></div>
    //   </div>
    // </div>
  );
}