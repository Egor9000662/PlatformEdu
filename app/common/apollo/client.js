import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
// const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBZG1pbiIsImlhdCI6MTY4OTY2NTc5NSwiZXhwIjoxNjkyMzQ0MTk1fQ.ZKn4-e1ZAVrbwwzGFkBxqlZC8aFKchLREPvLqiJBhGA'

// const httpLink = new HttpLink({
// 	uri: 'http://localhost:8083/graphql',
// 	headers: {
// 		authorization: `Bearer ${localStorage.getItem('token') || null}`,
// 	},
// })

// const client = new ApolloClient({
// 	link: httpLink,
// 	cache: new InMemoryCache(),
// });

const token = localStorage.getItem('token');
let httpLink;
if (token === null) {
	httpLink = new HttpLink({
		uri: 'http://84.201.138.176:8083/graphql?path=/graphql',
	})
} else {
	httpLink = new HttpLink({
		uri: 'http://84.201.138.176:8083/graphql?path=/graphql',
		headers: {
			authorization: `Bearer ${token}`,
		},
	})
}

const client = new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache(),
});

export default client;