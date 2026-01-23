// import axios from 'axios';

// const options = {
//   method: 'POST',
//   url: 'https://fast-email-sending-otp-verification.p.rapidapi.com/send_opt',
//   headers: {
//     'x-rapidapi-key': '4429b618bcmsh796a91750c69360p1be9f8jsnbf7079aaea18',
//     'x-rapidapi-host': 'fast-email-sending-otp-verification.p.rapidapi.com',
//     'Content-Type': 'application/json'
//   },
//   data: {
//     email: 'kmnaveen222@gmail.com',
//     language: 'en'
//   }
// };

// try {
// 	const response = await axios.request(options);
// 	console.log(response.data);
// } catch (error) {
// 	console.error(error);
// }





import axios from 'axios';

const options = {
  method: 'POST',
  url: 'https://email-signup-verification-free.p.rapidapi.com/verify-code',
  headers: {
    'x-rapidapi-key': '4429b618bcmsh796a91750c69360p1be9f8jsnbf7079aaea18',
    'x-rapidapi-host': 'email-signup-verification-free.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    email: 'kmnaveen222@gmail.com',
    code: '1234'
  }
};

try {
	const response = await axios.request(options);
	console.log(response.data);
} catch (error) {
	console.error(error);
}