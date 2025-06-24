package main

import "fmt"

func server() {
	fmt.Println("Server is running on port 8080")
}

func main() {
	fmt.Println("Hello from go-demo!")
	server()
}
