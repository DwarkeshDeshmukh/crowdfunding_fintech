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

  const donate = async (pId, amount) => {
    const payload = {
      amount: amount,
      userId: address,
      pid: pId
    };

    try {
      const response = await axios.post('http://localhost:8000/api/campaign/donate', payload);
      return response.data;
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