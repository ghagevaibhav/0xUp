function Error({ statusCode }) {
        return (
                <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                                {statusCode ? `Error ${statusCode}` : 'An error occurred'}
                        </h1>
                        <p style={{ marginTop: '1rem', color: '#666' }}>
                                {statusCode === 404 ? 'Page not found' : 'Something went wrong'}
                        </p>
                </div>
        )
}

Error.getInitialProps = ({ res, err }) => {
        const statusCode = res ? res.statusCode : err ? err.statusCode : 404
        return { statusCode }
}

export default Error
