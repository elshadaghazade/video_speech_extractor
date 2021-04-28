# TEXT EXTRACTOR SERVICE

THis service is written in Python using [SpeechRecognition](./https://pypi.org/project/SpeechRecognition/) module. Text extractor service gets uploaded video file from GridFS, splits it into chunks and then extracts text. Finally extracted texts are sent to the MongoDB.