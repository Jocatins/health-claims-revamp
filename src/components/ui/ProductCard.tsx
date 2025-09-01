import type { Product } from "../../types/Product";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
      <div className="relative h-48 w-full flex items-center justify-center p-4 bg-gray-100">
        <img 
          src={product.image} 
          alt={product.title}
          className="max-h-44 max-w-full object-contain"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg mb-2 truncate">{product.title}</h3>
        <p className="text-gray-600 mb-4 text-sm h-10 overflow-hidden">
          {product.description.length > 100 
            ? `${product.description.substring(0, 100)}...` 
            : product.description
          }
        </p>
        <div className="flex justify-between items-center mt-auto">
          <span className="font-bold text-xl">${product.price}</span>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded capitalize">
            {product.category}
          </span>
        </div>
        <div className="mt-2 flex items-center">
          <span className="text-yellow-500">★</span>
          <span className="ml-1 text-gray-600 text-sm">
            {product.rating.rate} ({product.rating.count} reviews)
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;