module.exports = {
	"env" : "development",

	"mysql": { //mysql 服务配置想项	
//		"host" : "192.168.9.27", // 可选, 缺省为127.0.0.1
//		"port" : "3306", // 可选,  缺省为3306
//		"user" : "root", // 可选, 缺省为root
//		"password" : "root",// 可选, 缺省为root
//		"db" : "pkgName", // 可选, 缺省为 package name
		// 给MySql Pool的配置项
		"waitForConnections" : true, // 请求会等待空闲链接,可选, 缺省为true
		"connectionLimit" : 64 //连接池的最大连接数，可选, 缺省为16;
	},
	"service" : {
		"port" : 4000,
		"useHTTPS" : false,
		
		"credentials" : {
			"cert":  [
				"-----BEGIN CERTIFICATE-----",
"MIICNTCCAZ4CCQDvkE/LLj2GOzANBgkqhkiG9w0BAQUFADBfMQswCQYDVQQGEwJD",
"TjELMAkGA1UECBMCQkoxEDAOBgNVBAcTB0JlaWppbmcxDzANBgNVBAoTBll1bmZp",
"czEPMA0GA1UECxMGWXVuZmlzMQ8wDQYDVQQDEwZZdW5maXMwHhcNMTMwOTAzMDEx",
"MDE2WhcNMTMxMDAzMDExMDE2WjBfMQswCQYDVQQGEwJDTjELMAkGA1UECBMCQkox",
"EDAOBgNVBAcTB0JlaWppbmcxDzANBgNVBAoTBll1bmZpczEPMA0GA1UECxMGWXVu",
"ZmlzMQ8wDQYDVQQDEwZZdW5maXMwgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGB",
"AK/4+FU+4vOMtD9Yv8uOwFB5rloOtw2itOwk14ZAGpmsioWkCGFbbX5Mpwhpi/Bj",
"n5k8Cfj15lmvCCmmsy0kyTa8QE8xx3uDOOyDwwGU0Ck1VgmMjoHjE7008zD4Rxpu",
"iB6kslGLcRASROyIOgq4CgSxR7E9eqHn0LyCEp/uMz4DAgMBAAEwDQYJKoZIhvcN",
"AQEFBQADgYEAGUhtyVUwLFrmTEaOgg22wSsG18nyDKOfb6sBeJkS9z4aLWzCSf86",
"0xH7Ebk/3TnUUedVIw3z5kEfzEr43A2g6EQsYmTKobDgfzCz1aBkbV64GtJfA9/W",
"ML/flSmQT8YotZPZaHSgWXzHK/XxWcNZfePj4eLETUmSTQciiYTn/IU=",
				"-----END CERTIFICATE-----"
				].join("\n"),
			"key" : [
				"-----BEGIN RSA PRIVATE KEY-----",
"MIICXQIBAAKBgQCv+PhVPuLzjLQ/WL/LjsBQea5aDrcNorTsJNeGQBqZrIqFpAhh",
"W21+TKcIaYvwY5+ZPAn49eZZrwgpprMtJMk2vEBPMcd7gzjsg8MBlNApNVYJjI6B",
"4xO9NPMw+EcabogepLJRi3EQEkTsiDoKuAoEsUexPXqh59C8ghKf7jM+AwIDAQAB",
"AoGBAJ4vwATZeCiZpnp/bEIvO//bsniwW6t9RQg2givjukXEje1erE3gY0gy3cA5",
"KRvaYmDcUNalLgIWzs6qVM1TETCN+sMwb/uS3BQaRiwzkRQc5z6VELhJD7FIwwgQ",
"bTlPv7wklmjpwXhCeaiRm3Kw4SnFsIWySCf5w1tCmEiwhqD5AkEA3nl4FymZqEOT",
"TAiUV9EWTAGpEWSHbONAsrWUfnCmUAUMUHFJC6ZFQv0VTBimeLZQMvN27xd763Ap",
"S0yBmkrZdQJBAMp9kUpBJszKIj4cQ/VL1Q4NCnQ9jqLXvSuoSpSpGhUzGpV+Stbs",
"nMHqILxrWU3jljhDPW1SoWQVOLZ03N6f0pcCQFvwvxxzaLkNFDZ75TJVim1m0kQJ",
"053AXOB+Ahwu2cyACZLE/nb+A+mnRcHo/gMs9P/ZdfFhNykZdTdVKspk3HECQQCs",
"+XcTp3QtnL6DsEGdWZo21o0Hn04pbYH7uVd8hrfxRCaBbdEgqB+AxzAPxOQU1UWN",
"6mKe8OdNR5OayVmkE4MhAkASbj1F7ThH2YJ2VGA1OL8TnV0IVch0FaYKFlarrHdX",
"G35q9fcz+2GPSRmOI94zY/FOGoYD2m16QNwx3DXeRmG3",
				"-----END RSA PRIVATE KEY-----"
				].join("\n"), 
			"ca":["IX"]
		}
	}
};