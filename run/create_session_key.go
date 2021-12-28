package main

import (
	"encoding/base64"
	"fmt"

	"github.com/gorilla/securecookie"
)

func main() {
	key := securecookie.GenerateRandomKey(32)

	encoded := base64.StdEncoding.EncodeToString(key)

	fmt.Printf("Secure key = %v\n", encoded)
	fmt.Printf("Thanks for playing!\n")
}
