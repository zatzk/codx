/* eslint-disable @typescript-eslint/no-unused-vars */

interface SimplePagHeaderProps {
  title: string
  description: string
}
export function SimplePagHeader( props: SimplePagHeaderProps ) {

  return (
    <div className="w-full pt-6 pb-5 sm:pt-12 sm:pb-10">
      <div className="max-w-[830px] mx-auto px-[1rem]">
      <h1 className="text-3xl sm:text-5xl mb-1 sm:mb-2 font-bold">{props.title}</h1>
      <p className=" text-sm sm:text-lg">{props.description}</p>
      </div>
    </div>
  )
}