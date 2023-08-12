
run-web:
	cd ./example/my-app && npm run dev 

gen:
	buf generate

deploy-server: # set regoion to be 10, and allow all trafic.
	gcloud run deploy cardinfoservice --source .
	
deploy-web:
	firebase deploy --only hosting
