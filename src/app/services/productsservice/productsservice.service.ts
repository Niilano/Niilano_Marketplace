import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, observable, Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsserviceService {

  listProduct(formData:FormData):Observable<{message:string,productID:number}>{
    return new Observable((observer)=>{
      this.http.post<{message:string,productID:number}>(`${environment.server}/products/list-product`,formData)
      .pipe(take(1))
      .subscribe(async(res)=>{
        observer.next({message:res.message,productID:res.productID})
        observer.complete()
      },(err)=>{
        observer.error({message:err.error.message})
        observer.complete()
      })
  
    })
  }

  editProduct(formData:FormData):Observable<{message:string}>{
    return new Observable((observer)=>{
      this.http.put<{message:string}>(`${environment.server}/products/edit-product`,formData)
      .pipe(take(1))
      .subscribe(async(res)=>{
        observer.next({message:res.message})
        observer.complete()
      },(err)=>{
        observer.error({message:err.error.message})
        observer.complete()
      })
  
    })
  }

  getCategoriesAndSubCategoies():Observable<any>{
    return this.http.get(`${environment.server}/products/categories`)
  }

  getUserProducts():Observable<{message:string,products:[]}>{
    return new Observable(observer=>{

      this.http.get<{products:any}>(`${environment.server}/products/user-products`)
    .pipe(take(1))
    .subscribe(async(res)=>{
      observer.next({message:"Products Provided",products:res.products})
      observer.complete()
    },(err)=>{
      observer.error({message:err.error.message})
      observer.complete()
    })

    })
  }

  getProducts(page:number):Observable<{message:string,products:[],productsAvailable:number}>{
    return new Observable(observer=>{

      this.http.get<{products:any,productsAvailable:number}>(`${environment.server}/products/products/${page}`)
    .pipe(take(1))
    .subscribe(async(res)=>{
      observer.next({message:"Products Provided",products:res.products,productsAvailable:res.productsAvailable})
      localStorage.setItem('currentPage',String(page))
      observer.complete()
    },(err)=>{
      observer.error({message:err.error.message})
      observer.complete()
    })

    })
  }

  getProduct(productID:Number,details:string):Observable<{message:string,product:[]}>{
    return new Observable(observer=>{

      this.http.get<{product:any}>(`${environment.server}/products/product/${productID}/${details}`)
    .pipe(take(1))
    .subscribe(async(res)=>{
      observer.next({message:"Products Provided",product:res.product})
      observer.complete()
    },(err)=>{
      observer.error({message:err.error.message})
      observer.complete()
    })

    })
  }

  filterProducts(filters:any):Observable<{message:string,products:[],productsAvailable:number}>{
    return new Observable(observer=>{

      this.http.get<{products:any,productsAvailable:number}>(`${environment.server}/products/filter`,{ params: filters})
    .pipe(take(1))
    .subscribe(async(res)=>{
      observer.next({message:"Products Provided",products:res.products,productsAvailable: res.productsAvailable})
      observer.complete()
    },(err)=>{
      // observer.error({message:err.error.message})
      observer.complete()
    })

    })
  }


  removeProduct(productID:Number):Observable<{message:string}>{
    return new Observable(observer=>{

      this.http.get<{message:any}>(`${environment.server}/products/delete-product/${productID}`)
    .pipe(take(1))
    .subscribe(async(res)=>{
      observer.next({message:res.message})
      observer.complete()
    },(err)=>{
      observer.error({message:err.error.message})
      observer.complete()
    })

    })
  }

  getProductsSummary():Observable<{products:{}}>{
    return new Observable(observer=>{

      this.http.get(`${environment.server}/products/productsSummary/1`)
    .pipe(take(1))
    .subscribe(async(res)=>{
      console.log(res)
      observer.next({products:res})
      observer.complete()
    },(err)=>{
      console.log(err)
      observer.error({message:err.error.message ? err.error.message : "Unable to connect"})
      observer.complete()
    })
    })
  }

  constructor(private http:HttpClient) { 
    
  }
}
