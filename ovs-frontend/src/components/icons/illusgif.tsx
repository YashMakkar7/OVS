function IllusGif() {
    return (
        <div className="flex flex-col items-end">
            <div 
                style={{ 
                    backgroundColor: '#f2f5fd',
                    borderRadius: '20px',
                    padding: '10px',
                    overflow: 'hidden',
                    maxWidth: '480px',
                    animation: 'float 3s ease-in-out infinite'
                }}
                className="shadow-sm"
            >
                <img 
                    src="/voting.gif" 
                    alt="Voting Illustration" 
                    className="w-full h-auto rounded-xl"
                />
            </div>
        </div>
    );
}

export default IllusGif;