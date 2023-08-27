
run-web:
	cd ./example/my-app && npm run dev 

gen:
	buf generate

deploy-web:
	firebase deploy --only hosting
