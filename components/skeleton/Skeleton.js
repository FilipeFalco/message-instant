import { Box, Image, Text } from "@skynexui/components";

export default function Skeleton() {
  const COUNTER = 7;
  const MessageSkeleton = () => (
    <div className="messageBody">
      <style jsx>
        {`
          .userImage {
            background-color: #425263;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 8px;
          }

          .messageBody {
            margin-bottom: 12px;
            animation: skeleton 1s ease infinite alternate;
          }

          @keyframes skeleton {
            to {
              opacity: 0.5;
            }
          }

          .userName {
            display: inline-block;
            width: 20%;
            height: 20px;
            background-color: #425263;
          }
          .message {
            width: 40%;
            height: 20px;
            background-color: #425263;
          }
        `}
      </style>
      <Box
        styleSheet={{
          marginBottom: "8px",
        }}
      >
        <div className="userImage"></div>
        <div className="userName"></div>
      </Box>
      <div className="message"></div>
    </div>
  );
  return Array(COUNTER).fill(<MessageSkeleton />);
}
