import { AuthProvider } from "./context/auth.context.tsx";
import { CartProvider } from "./context/cart.context.tsx";
import { ChatProvider } from "./context/chat.context.tsx";
import { CommentProvider } from "./context/comments.context.tsx";
import { ProductProvider } from "./context/products.context.tsx";
import { UtilsProvider } from "./context/utils.context.tsx";
import "./hooks/useLazyLoading.tsx";
import { AppRouter } from "./routes/index.tsx";

function App() {
  return (
    <CartProvider>
      <ChatProvider>
        <AuthProvider>
          <ProductProvider>
            <CommentProvider>
              <UtilsProvider>
                <AppRouter></AppRouter>
              </UtilsProvider>
            </CommentProvider>
          </ProductProvider>
        </AuthProvider>
      </ChatProvider>
    </CartProvider>
  );
}

export default App;
