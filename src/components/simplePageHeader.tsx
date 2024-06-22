/* eslint-disable @typescript-eslint/no-unused-vars */

interface SimplePagHeaderProps {
  title: string
  description: string
}
export function SimplePagHeader( props: SimplePagHeaderProps ) {

  return (
    <div className="w-full pt-6 pb-5 sm:pt-12 sm:pb-10">
      <div className="max-w-[830px] mx-auto px-[1rem]">
      <h1 className="text-white text-3xl sm:text-5xl mb-3 sm:mb-4 font-bold">{props.title}</h1>
      <p className="text-gray-400 ml-1 text-lg">{props.description}</p>
      </div>
    </div>
  )
}