import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CategorySectionProps {
  title: string;
  description: string;
  image: string;
  link: string;
  gradient: string;
}

export const CategorySection = ({
  title,
  description,
  image,
  link,
  gradient,
}: CategorySectionProps) => {
  return (
    <Link to={link} className="group">
      <div className={`relative h-64 overflow-hidden rounded-2xl ${gradient} transition-all duration-300 hover:shadow-hover`}>
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40" />
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
          <h3 className="mb-2 text-3xl font-bold drop-shadow-lg">{title}</h3>
          <p className="mb-4 text-sm drop-shadow-md">{description}</p>
          <Button
            variant="secondary"
            className="group-hover:translate-x-1 transition-transform"
          >
            Explore Collection
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
};
