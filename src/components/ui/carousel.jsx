import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { cn } from "@/lib/utils"

const Carousel = React.forwardRef(({ orientation = "horizontal", opts, setApi, plugins, className, children, ...props }, ref) => {
  const [carouselRef, api] = useEmblaCarousel({
    ...opts,
    axis: orientation === "horizontal" ? "x" : "y",
  }, plugins)

  return (
    <div ref={ref} className={cn("relative", className)} role="region" aria-roledescription="carousel" {...props}>
      <div ref={carouselRef} className="overflow-hidden">
        <div className={cn("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col")}>
          {children}
        </div>
      </div>
    </div>
  )
})
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex", className)} {...props} />
))
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="group"
    aria-roledescription="slide"
    className={cn(
      "min-w-0 shrink-0 grow-0 basis-full",
      className
    )}
    {...props}
  />
)
)
CarouselItem.displayName = "CarouselItem"

export { Carousel, CarouselContent, CarouselItem }
