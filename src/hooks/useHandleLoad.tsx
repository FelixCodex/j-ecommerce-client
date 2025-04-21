import { useUtils } from "./useUtils"

export function useHandleLoad(){

    const { setIsLoading} = useUtils()

  const handleLoad = ()=>{
    setIsLoading(false)
  }       
  return {handleLoad}
}