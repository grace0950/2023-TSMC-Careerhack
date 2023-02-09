package main

import (
	b64 "encoding/base64"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Data struct {
	A int `json:"a"`
	B int `json:"b"`
	C int `json:"c"`
	D int `json:"d"`
}

type Order struct {
	Location   string `json:"location"`
	Timestamp  string `json:"timestamp"`
	Data       Data   `json:"data"`
	CreateTime int    `json:"createTime"`
}

type Record struct {
	Location   string `json:"location"`
	Timestamp  string `json:"timestamp"`
	Signature  string
	Material   int
	A          int
	B          int
	C          int
	D          int
	CreateTime int
}

func main() {
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})
	r.POST("/", func(c *gin.Context) {
		var order Order
		err := c.ShouldBindJSON(&order)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Bad Request",
			})
		}
		record := Record{}
		record.Location = order.Location
		record.Timestamp = order.Timestamp
		// signature is the base64 of int(material.a + material.b + material.c + material.d)
		record.Signature = b64.StdEncoding.EncodeToString([]byte(string(order.Data.A + order.Data.B + order.Data.C + order.Data.D)))
		record.Material = order.Data.A*3 + order.Data.B*2 + order.Data.C*4 + order.Data.D*10
		record.A = order.Data.A
		record.B = order.Data.B
		record.C = order.Data.C
		record.D = order.Data.D
		record.CreateTime = order.CreateTime
		c.JSON(http.StatusOK, record)
	})

	s := &http.Server{
		Addr:    ":8200",
		Handler: r,
	}

	s.ListenAndServe()
}
