import ProductCard from "../components/ui/ProductCard";
import { useProducts } from "../hooks/useProducts";

const ProductsList: React.FC = () => {
  const { products, isLoading, isError, error } = useProducts();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading products...</span>
      </div>
    );
  }

  if (isError) {
    let errorMessage = "An error occurred while fetching products";

    if (error && "status" in error) {
      errorMessage = `Error ${error.status}: ${JSON.stringify(error.data)}`;
    } else if (error && "message" in error) {
      errorMessage = error.message || "Unknown error occurred";
    }

    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-2xl mx-auto">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{errorMessage}</span>
      </div>
    );
  }

  // to check if products is defined and not empty
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsList;
