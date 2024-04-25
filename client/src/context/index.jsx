import React, { useContext, createContext } from 'react';
import axios from 'axios';


import { ethers } from 'ethers';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {

  const contract = null;

  const address = "6628d27cb350e411b58a4b90";


  const publishCampaign = async (form) => {
    try {
      const formData = {
        owner: address,
        title: form.title,
        description: form.description,
        target: form.target,
        deadline: form.deadline,
        image: form.image
      };
      const response = await axios.post('http://localhost:8000/api/campaign/create', formData);
      console.log("contract call success", response.data);
    } catch (error) {
      console.log("contract call failure", error);
    }
  }

  const getCampaigns = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/campaign/getall');
      const campaigns = response.data;
      const parsedCampaigns = campaigns.map((campaign) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: campaign.target,
        deadline: campaign.deadline,
        amountCollected: campaign.amountCollected,
        image: campaign.image,
        pId: campaign._id
      }));
      return parsedCampaigns;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  }

  const getUserCampaigns = async () => {
    const response = await axios.get('http://localhost:8000/api/campaign/getall');

    const allCampaigns = response.data;

    console.log(allCampaigns)

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns;
  }







  // PID is campaign id

  const donate = async (pId, amount) => {
    try {
      const response = await fetch('http://localhost:8000/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount,
          userId: address, // Include user ID here
          currency: 'INR',
          pid: pId
        })
      });
  
      const order = await response.json();
  
      var option = {
        key: "rzp_test_Bq6H5OBCpA4XMl", 
        amount,
        currency: 'INR',
        name: "Web Codder",
        description: "Test Transaction",
        image: "https://i.ibb.co/5Y3m33n/test.png",
        order_id: order.id,
        prefill: {
          name: "Web Coder", 
          email: "webcoder@example.com",
          contact: "9000000000", 
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };
  
      var rzp1 = new Razorpay(option);
      rzp1.open();
  
      rzp1.on("payment.failed", function(response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });
  
      rzp1.on("payment.success", function(response) {
        
        console.log("Payment successful", response);
      });
  
    } catch (error) {
      console.error('Error donating:', error);
      throw error; // Rethrow the error to handle it outside of the function
    }
  };
  












  async function getDonations(pId) {
    try {
      const response = await axios.get(`http://localhost:8000/api/campaign/donations/${pId}`);

      // Extract the parsed donations from the response data
      const parsedDonations = response.data;

      return parsedDonations;
    } catch (error) {
      console.error('Error fetching donations:', error);
      throw error; // You can handle or rethrow the error as needed
    }
  }


  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);